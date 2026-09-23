import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { OfficialAlert } from "./types";

export interface CapValidationError {
  field: string;
  message: string;
}

export interface CapValidationResult {
  valid: boolean;
  errors: CapValidationError[];
  parsedObject?: any;
}

export function generateCap12Xml(alert: Partial<OfficialAlert>): string {
  const identifier = alert.alert_identifier || `IN-NDMA-${Date.now()}`;
  const sender = "ndma-sachet-authority@ndma.gov.in";
  const sent = alert.effective_at || new Date().toISOString();

  const capObj = {
    alert: {
      "@_xmlns": "urn:oasis:names:tc:emergency:cap:1.2",
      identifier,
      sender,
      sent,
      status: "Actual",
      msgType: "Alert",
      source: alert.source_name || "NDMA SACHET",
      scope: "Public",
      info: {
        language: alert.language || "en",
        category: alert.category || "Geo",
        event: alert.headline || "Hazard Notice",
        urgency: alert.urgency || "Expected",
        severity: alert.severity || "Moderate",
        certainty: alert.certainty || "Likely",
        headline: alert.headline,
        description: alert.description,
        instruction: alert.instruction || "Follow directives of District Administration.",
        expires: alert.expires_at || new Date(Date.now() + 86400000).toISOString(),
        senderName: alert.source_name || "NDMA Emergency Operations Centre",
        area: {
          areaDesc: alert.area_description || "Designated Hazard Affected Area",
          circle: alert.area_polygon ? undefined : "30.55,79.56,15.0",
        },
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });

  return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(capObj);
}

export function validateCap12Xml(xmlContent: string): CapValidationResult {
  const errors: CapValidationError[] = [];

  if (!xmlContent || typeof xmlContent !== "string" || xmlContent.trim().length === 0) {
    return {
      valid: false,
      errors: [{ field: "root", message: "XML content is empty or invalid" }],
    };
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  try {
    const parsed = parser.parse(xmlContent);
    const alert = parsed.alert;

    if (!alert) {
      errors.push({ field: "alert", message: "Missing root <alert> node" });
      return { valid: false, errors };
    }

    // Required CAP 1.2 root fields
    const requiredRootFields = ["identifier", "sender", "sent", "status", "msgType", "scope"];
    for (const f of requiredRootFields) {
      if (!alert[f]) {
        errors.push({ field: `alert.${f}`, message: `Missing required element <${f}>` });
      }
    }

    // Info block
    const info = alert.info;
    if (!info) {
      errors.push({ field: "alert.info", message: "Missing required element <info>" });
    } else {
      const requiredInfoFields = ["category", "event", "urgency", "severity", "certainty"];
      for (const f of requiredInfoFields) {
        if (!info[f]) {
          errors.push({ field: `alert.info.${f}`, message: `Missing required element <${f}> in <info>` });
        }
      }

      // Valid enum checks
      const validSeverities = ["Extreme", "Severe", "Moderate", "Minor", "Unknown"];
      if (info.severity && !validSeverities.includes(info.severity)) {
        errors.push({
          field: "alert.info.severity",
          message: `Invalid severity value '${info.severity}'. Expected one of: ${validSeverities.join(", ")}`,
        });
      }

      const validUrgencies = ["Immediate", "Expected", "Future", "Past", "Unknown"];
      if (info.urgency && !validUrgencies.includes(info.urgency)) {
        errors.push({
          field: "alert.info.urgency",
          message: `Invalid urgency value '${info.urgency}'. Expected one of: ${validUrgencies.join(", ")}`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      parsedObject: parsed,
    };
  } catch (err: any) {
    return {
      valid: false,
      errors: [{ field: "parser", message: `XML parse failed: ${err.message}` }],
    };
  }
}
