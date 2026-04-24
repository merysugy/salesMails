import type {
  EmailBlock,
  EmailDocument,
  EmailRenderData,
  EmailVariableDefinition,
} from "@/lib/email-builder/types";

export const emailVariableDefinitions: EmailVariableDefinition[] = [
  {
    key: "{{cliente.nombre}}",
    label: "Nombre del cliente",
    example: "Ana María Moreno",
  },
  {
    key: "{{cliente.empresa}}",
    label: "Empresa del cliente",
    example: "Abalia Consulting SL",
  },
  {
    key: "{{cliente.email}}",
    label: "Email del cliente",
    example: "usuario@empresa.com",
  },
  {
    key: "{{campana.nombre}}",
    label: "Nombre de campaña",
    example: "Recuperación Q2",
  },
  {
    key: "{{campana.propuestaValor}}",
    label: "Propuesta de valor",
    example: "Automatizar emails comerciales",
  },
  {
    key: "{{campana.remitente}}",
    label: "Remitente",
    example: "María Fernández",
  },
  {
    key: "{{empresa.nombre}}",
    label: "Empresa emisora",
    example: "SalesMails",
  },
  {
    key: "{{empresa.web}}",
    label: "Web corporativa",
    example: "salesmails.app",
  },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function getByPath(data: EmailRenderData, path: string) {
  const value = path.split(".").reduce<unknown>((accumulator, segment) => {
    if (typeof accumulator !== "object" || accumulator === null) {
      return "";
    }

    return (accumulator as Record<string, unknown>)[segment];
  }, data);

  return typeof value === "string" ? value : "";
}

export function resolveVariables(value: string, data: EmailRenderData) {
  return value.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_match, path) => {
    const resolved = getByPath(data, String(path).trim());
    return resolved || `{{${String(path).trim()}}}`;
  });
}

function renderText(value: string, data: EmailRenderData) {
  return nl2br(resolveVariables(value, data));
}

function renderBlock(block: EmailBlock, document: EmailDocument, data: EmailRenderData) {
  const baseText = document.theme.textColor;
  const heading = document.theme.headingColor;
  const muted = document.theme.mutedColor;
  const accent = document.theme.accentColor;

  switch (block.type) {
    case "hero": {
      const align = block.styles.align;

      return `
        <tr>
          <td style="padding:32px 40px;background:${block.styles.backgroundColor};text-align:${align};color:${block.styles.textColor};">
            <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${accent};font-weight:700;margin-bottom:12px;">
              ${renderText(block.content.eyebrow, data)}
            </div>
            <div style="font-size:32px;line-height:1.2;color:${heading};font-weight:700;margin-bottom:16px;">
              ${renderText(block.content.title, data)}
            </div>
            <div style="font-size:16px;line-height:1.6;color:${baseText};margin-bottom:24px;">
              ${renderText(block.content.body, data)}
            </div>
            <a href="${escapeHtml(block.content.ctaUrl)}" style="display:inline-block;padding:12px 18px;background:${accent};color:#ffffff;border-radius:999px;text-decoration:none;font-weight:700;">
              ${renderText(block.content.ctaLabel, data)}
            </a>
          </td>
        </tr>
      `;
    }
    case "texto":
      return `
        <tr>
          <td style="padding:28px 40px 12px 40px;text-align:${block.styles.align};">
            <div style="font-size:24px;line-height:1.3;color:${heading};font-weight:700;margin-bottom:12px;">
              ${renderText(block.content.title, data)}
            </div>
            <div style="font-size:15px;line-height:1.7;color:${baseText};">
              ${renderText(block.content.body, data)}
            </div>
          </td>
        </tr>
      `;
    case "imagen": {
      const radius = block.styles.rounded ? "18px" : "0";

      return `
        <tr>
          <td style="padding:24px 40px 8px 40px;">
            <img src="${escapeHtml(block.content.imageUrl)}" alt="${escapeHtml(block.content.alt)}" width="${Math.round((document.theme.width - 80) * (block.styles.width / 100))}" style="display:block;width:${block.styles.width}%;max-width:100%;height:auto;border-radius:${radius};" />
            ${
              block.content.caption
                ? `<div style="padding-top:10px;font-size:12px;line-height:1.5;color:${muted};">${renderText(block.content.caption, data)}</div>`
                : ""
            }
          </td>
        </tr>
      `;
    }
    case "cta":
      return `
        <tr>
          <td style="padding:24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${block.styles.backgroundColor};border-radius:20px;">
              <tr>
                <td style="padding:28px;text-align:${block.styles.align};">
                  <div style="font-size:22px;line-height:1.3;color:${heading};font-weight:700;margin-bottom:10px;">
                    ${renderText(block.content.title, data)}
                  </div>
                  <div style="font-size:15px;line-height:1.6;color:${baseText};margin-bottom:18px;">
                    ${renderText(block.content.body, data)}
                  </div>
                  <a href="${escapeHtml(block.content.buttonUrl)}" style="display:inline-block;padding:12px 18px;background:${block.styles.buttonColor};color:${block.styles.buttonTextColor};border-radius:999px;text-decoration:none;font-weight:700;">
                    ${renderText(block.content.buttonLabel, data)}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    case "separador":
      return `
        <tr>
          <td style="padding:${block.styles.spacing}px 40px 12px 40px;">
            ${
              block.content.label
                ? `<div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${muted};font-weight:700;margin-bottom:12px;">${renderText(block.content.label, data)}</div>`
                : ""
            }
            <div style="height:1px;background:${block.styles.color};"></div>
          </td>
        </tr>
      `;
    case "dosColumnas":
      return `
        <tr>
          <td style="padding:24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${block.styles.backgroundColor};border-radius:20px;">
              <tr>
                <td width="50%" valign="top" style="padding:24px 18px 24px 24px;">
                  <div style="font-size:18px;line-height:1.35;color:${heading};font-weight:700;margin-bottom:10px;">
                    ${renderText(block.content.leftTitle, data)}
                  </div>
                  <div style="font-size:14px;line-height:1.7;color:${baseText};">
                    ${renderText(block.content.leftBody, data)}
                  </div>
                </td>
                <td width="50%" valign="top" style="padding:24px 24px 24px 18px;">
                  <div style="font-size:18px;line-height:1.35;color:${heading};font-weight:700;margin-bottom:10px;">
                    ${renderText(block.content.rightTitle, data)}
                  </div>
                  <div style="font-size:14px;line-height:1.7;color:${baseText};">
                    ${renderText(block.content.rightBody, data)}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    case "firma":
      return `
        <tr>
          <td style="padding:24px 40px 18px 40px;">
            <div style="font-size:18px;line-height:1.4;color:${heading};font-weight:700;margin-bottom:6px;">
              ${renderText(block.content.name, data)}
            </div>
            <div style="font-size:14px;line-height:1.6;color:${baseText};margin-bottom:2px;">
              ${renderText(block.content.role, data)}
            </div>
            <div style="font-size:14px;line-height:1.6;color:${block.styles.accentColor};font-weight:700;margin-bottom:14px;">
              ${renderText(block.content.company, data)}
            </div>
            <div style="font-size:14px;line-height:1.7;color:${muted};">
              ${renderText(block.content.note, data)}
            </div>
          </td>
        </tr>
      `;
    case "footer":
      return `
        <tr>
          <td style="padding:20px 40px 32px 40px;text-align:${block.styles.align};">
            <div style="font-size:12px;line-height:1.6;color:${muted};margin-bottom:6px;">
              ${renderText(block.content.companyLine, data)}
            </div>
            <div style="font-size:12px;line-height:1.6;color:${muted};margin-bottom:6px;">
              ${renderText(block.content.address, data)}
            </div>
            <div style="font-size:12px;line-height:1.6;color:${muted};">
              ${renderText(block.content.legal, data)}
            </div>
          </td>
        </tr>
      `;
    default: {
      const exhaustiveCheck: never = block;
      return exhaustiveCheck;
    }
  }
}

export function renderEmailDocument(document: EmailDocument, data: EmailRenderData) {
  const content = document.blocks
    .map((block) => renderBlock(block, document, data))
    .join("");

  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(document.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${document.theme.backgroundColor};font-family:${document.theme.fontFamily};">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
      ${renderText(document.preheader, data)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${document.theme.backgroundColor};margin:0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="${document.theme.width}" cellpadding="0" cellspacing="0" style="width:100%;max-width:${document.theme.width}px;background:${document.theme.surfaceColor};border-collapse:separate;border-spacing:0;border-radius:28px;overflow:hidden;">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
