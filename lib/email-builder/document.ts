import type {
  BlockDefinition,
  CtaBlock,
  DividerBlock,
  EmailBlock,
  EmailBlockType,
  EmailDocument,
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateVariant,
  FooterBlock,
  HeroBlock,
  ImageBlock,
  SignatureBlock,
  TextBlock,
  TwoColumnsBlock,
} from "@/lib/email-builder/types";

const defaultTheme = {
  width: 640,
  backgroundColor: "#f6f0e4",
  surfaceColor: "#ffffff",
  textColor: "#2a2a2a",
  mutedColor: "#786f62",
  accentColor: "#8b6914",
  headingColor: "#171717",
  fontFamily: "Arial, Helvetica, sans-serif",
} as const;

export const blockDefinitions: BlockDefinition[] = [
  {
    type: "hero",
    title: "Hero",
    description: "Bloque de apertura con titular, contexto y CTA principal.",
  },
  {
    type: "texto",
    title: "Texto",
    description: "Contenido descriptivo para explicar la propuesta.",
  },
  {
    type: "imagen",
    title: "Imagen",
    description: "Imagen de apoyo con caption opcional.",
  },
  {
    type: "cta",
    title: "CTA",
    description: "Llamada a la acción con botón destacado.",
  },
  {
    type: "separador",
    title: "Separador",
    description: "Divide visualmente secciones del email.",
  },
  {
    type: "dosColumnas",
    title: "Dos columnas",
    description: "Comparativa o beneficios lado a lado.",
  },
  {
    type: "firma",
    title: "Firma",
    description: "Cierre comercial y datos del remitente.",
  },
  {
    type: "footer",
    title: "Footer",
    description: "Pie legal y datos corporativos.",
  },
];

function createId(prefix: string, seed?: string) {
  if (seed) {
    return `${prefix}-${seed}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function cloneDocument(document: EmailDocument): EmailDocument {
  return JSON.parse(JSON.stringify(document)) as EmailDocument;
}

export function cloneTemplate(template: EmailTemplate): EmailTemplate {
  return JSON.parse(JSON.stringify(template)) as EmailTemplate;
}

export function createBlock(type: "hero", idSeed?: string): HeroBlock;
export function createBlock(type: "texto", idSeed?: string): TextBlock;
export function createBlock(type: "imagen", idSeed?: string): ImageBlock;
export function createBlock(type: "cta", idSeed?: string): CtaBlock;
export function createBlock(type: "separador", idSeed?: string): DividerBlock;
export function createBlock(type: "dosColumnas", idSeed?: string): TwoColumnsBlock;
export function createBlock(type: "firma", idSeed?: string): SignatureBlock;
export function createBlock(type: "footer", idSeed?: string): FooterBlock;
export function createBlock(type: EmailBlockType, idSeed?: string): EmailBlock;
export function createBlock(type: EmailBlockType, idSeed?: string): EmailBlock {
  const id = createId("block", idSeed);

  switch (type) {
    case "hero":
      return {
        id,
        type,
        content: {
          eyebrow: "Contacto personalizado",
          title: "Hola {{cliente.nombre}}, una idea para {{cliente.empresa}}",
          body:
            "Hemos preparado una propuesta breve para ayudarte a acelerar resultados comerciales con un mensaje más claro y automatizado.",
          ctaLabel: "Reservar una llamada",
          ctaUrl: "https://salesmails.app/demo",
        },
        styles: {
          align: "left",
          backgroundColor: "#fff7eb",
          textColor: "#171717",
        },
      };
    case "texto":
      return {
        id,
        type,
        content: {
          title: "Por que puede encajar ahora",
          body:
            "Vimos que vuestro ultimo contexto fue {{cliente.ultimoContacto}} y creemos que hay margen para reactivar conversacion con una secuencia mas afinada para {{cliente.empresa}}.",
        },
        styles: {
          align: "left",
        },
      };
    case "imagen":
      return {
        id,
        type,
        content: {
          imageUrl:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
          alt: "Equipo revisando una propuesta",
          caption: "Resumen visual de la propuesta.",
        },
        styles: {
          width: 100,
          rounded: true,
        },
      };
    case "cta":
      return {
        id,
        type,
        content: {
          title: "Siguiente paso",
          body:
            "Si te encaja, podemos enseñarte un ejemplo real aplicado a una campaña como {{campana.nombre}}.",
          buttonLabel: "Ver ejemplo",
          buttonUrl: "https://salesmails.app/preview",
        },
        styles: {
          align: "left",
          backgroundColor: "#f5efe1",
          buttonColor: "#8b6914",
          buttonTextColor: "#ffffff",
        },
      };
    case "separador":
      return {
        id,
        type,
        content: {
          label: "Beneficios clave",
        },
        styles: {
          color: "#d7c8a7",
          spacing: 24,
        },
      };
    case "dosColumnas":
      return {
        id,
        type,
        content: {
          leftTitle: "Menos fricción",
          leftBody: "Bloques reutilizables y copy más claro para cada cliente.",
          rightTitle: "Más velocidad",
          rightBody: "Versionado, exportación HTML y variables dinámicas listas para usar.",
        },
        styles: {
          backgroundColor: "#fbf7ef",
        },
      };
    case "firma":
      return {
        id,
        type,
        content: {
          name: "{{campana.remitente}}",
          role: "Consultoría comercial",
          company: "{{empresa.nombre}}",
          note: "Si prefieres, te lo envío adaptado a vuestro sector antes de la llamada.",
        },
        styles: {
          accentColor: "#8b6914",
        },
      };
    case "footer":
      return {
        id,
        type,
        content: {
          companyLine: "{{empresa.nombre}} | {{empresa.web}}",
          address: "Madrid, España",
          legal: "Has recibido este email porque formas parte de una lista comercial activa.",
        },
        styles: {
          align: "center",
        },
      };
    default: {
      const exhaustiveCheck: never = type;
      return exhaustiveCheck;
    }
  }
}

export function createDefaultDocument(title: string, seedKey?: string): EmailDocument {
  return {
    id: createId("document", seedKey ? `${seedKey}-document` : undefined),
    title,
    preheader: "Propuesta personalizada para abrir conversación y acelerar respuesta.",
    theme: { ...defaultTheme },
    blocks: [
      createBlock("hero", seedKey ? `${seedKey}-hero` : undefined),
      createBlock("texto", seedKey ? `${seedKey}-texto` : undefined),
      createBlock("separador", seedKey ? `${seedKey}-separador` : undefined),
      createBlock("dosColumnas", seedKey ? `${seedKey}-dos-columnas` : undefined),
      createBlock("cta", seedKey ? `${seedKey}-cta` : undefined),
      createBlock("firma", seedKey ? `${seedKey}-firma` : undefined),
      createBlock("footer", seedKey ? `${seedKey}-footer` : undefined),
    ],
  };
}

export function createTemplateVersion(
  document: EmailDocument,
  versionNumber: number,
  seedKey?: string,
) {
  return {
    id: createId("version", seedKey ? `${seedKey}-v${versionNumber}` : undefined),
    label: `v${versionNumber}`,
    createdAt: new Date().toISOString(),
    document: cloneDocument(document),
  };
}

export function createTemplateSeed(input: {
  titulo: string;
  descripcion: string;
  categoria: EmailTemplateCategory;
  variante: EmailTemplateVariant;
  destacado?: boolean;
  seedKey?: string;
  status?: "draft" | "published";
  updatedAt?: string;
}): EmailTemplate {
  const document = createDefaultDocument(input.titulo, input.seedKey);
  const updatedAt = input.updatedAt ?? new Date().toISOString();

  return {
    id: createId("template", input.seedKey),
    titulo: input.titulo,
    descripcion: input.descripcion,
    categoria: input.categoria,
    variante: input.variante,
    destacado: input.destacado,
    status: input.status ?? "draft",
    updatedAt,
    document,
    versions: [createTemplateVersion(document, 1, input.seedKey)],
  };
}

export function insertBlock(
  document: EmailDocument,
  blockType: EmailBlockType,
  index?: number,
) {
  const blocks = [...document.blocks];
  const nextBlock = createBlock(blockType);

  if (index === undefined || index < 0 || index >= blocks.length) {
    blocks.push(nextBlock);
  } else {
    blocks.splice(index + 1, 0, nextBlock);
  }

  return {
    document: {
      ...document,
      blocks,
    },
    insertedBlockId: nextBlock.id,
  };
}

export function updateBlockInDocument(
  document: EmailDocument,
  blockId: string,
  updater: (block: EmailBlock) => EmailBlock,
) {
  return {
    ...document,
    blocks: document.blocks.map((block) =>
      block.id === blockId ? updater(block) : block,
    ),
  };
}

export function removeBlock(document: EmailDocument, blockId: string) {
  return {
    ...document,
    blocks: document.blocks.filter((block) => block.id !== blockId),
  };
}

export function duplicateBlock(document: EmailDocument, blockId: string) {
  const index = document.blocks.findIndex((block) => block.id === blockId);

  if (index === -1) {
    return { document, duplicatedBlockId: "" };
  }

  const source = document.blocks[index];
  const duplicated = {
    ...JSON.parse(JSON.stringify(source)),
    id: createId("block"),
  } as EmailBlock;
  const blocks = [...document.blocks];
  blocks.splice(index + 1, 0, duplicated);

  return {
    document: {
      ...document,
      blocks,
    },
    duplicatedBlockId: duplicated.id,
  };
}

export function moveBlock(
  document: EmailDocument,
  sourceId: string,
  destinationId: string,
) {
  const sourceIndex = document.blocks.findIndex((block) => block.id === sourceId);
  const destinationIndex = document.blocks.findIndex(
    (block) => block.id === destinationId,
  );

  if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
    return document;
  }

  const blocks = [...document.blocks];
  const [source] = blocks.splice(sourceIndex, 1);
  blocks.splice(destinationIndex, 0, source);

  return {
    ...document,
    blocks,
  };
}

export function moveBlockByOffset(
  document: EmailDocument,
  blockId: string,
  offset: -1 | 1,
) {
  const currentIndex = document.blocks.findIndex((block) => block.id === blockId);

  if (currentIndex === -1) {
    return document;
  }

  const targetIndex = currentIndex + offset;

  if (targetIndex < 0 || targetIndex >= document.blocks.length) {
    return document;
  }

  return moveBlock(document, blockId, document.blocks[targetIndex].id);
}

export function duplicateTemplateSeed(template: EmailTemplate): EmailTemplate {
  const cloned = cloneTemplate(template);
  const nextDocument = cloneDocument(cloned.document);
  nextDocument.id = createId("document");
  nextDocument.blocks = nextDocument.blocks.map((block) => ({
    ...block,
    id: createId("block"),
  }));

  return {
    ...cloned,
    id: createId("template"),
    titulo: `${cloned.titulo} copia`,
    status: "draft",
    updatedAt: new Date().toISOString(),
    document: nextDocument,
    versions: [createTemplateVersion(nextDocument, 1)],
  };
}
