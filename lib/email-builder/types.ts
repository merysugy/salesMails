export type EmailTemplateCategory =
  | "Primer contacto"
  | "Seguimiento"
  | "Reactivación"
  | "Cierre";

export type EmailTemplateVariant = "amber" | "sage" | "stone" | "charcoal";

export type EmailTemplateStatus = "draft" | "published";

export type EmailViewport = "desktop" | "mobile";

export type EmailVariableDefinition = {
  key: string;
  label: string;
  example: string;
};

export type EmailTheme = {
  width: number;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  headingColor: string;
  fontFamily: string;
};

export type HeroBlock = {
  id: string;
  type: "hero";
  content: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  styles: {
    align: "left" | "center";
    backgroundColor: string;
    textColor: string;
  };
};

export type TextBlock = {
  id: string;
  type: "texto";
  content: {
    title: string;
    body: string;
  };
  styles: {
    align: "left" | "center";
  };
};

export type ImageBlock = {
  id: string;
  type: "imagen";
  content: {
    imageUrl: string;
    alt: string;
    caption: string;
  };
  styles: {
    width: number;
    rounded: boolean;
  };
};

export type CtaBlock = {
  id: string;
  type: "cta";
  content: {
    title: string;
    body: string;
    buttonLabel: string;
    buttonUrl: string;
  };
  styles: {
    align: "left" | "center";
    backgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
};

export type DividerBlock = {
  id: string;
  type: "separador";
  content: {
    label: string;
  };
  styles: {
    color: string;
    spacing: number;
  };
};

export type TwoColumnsBlock = {
  id: string;
  type: "dosColumnas";
  content: {
    leftTitle: string;
    leftBody: string;
    rightTitle: string;
    rightBody: string;
  };
  styles: {
    backgroundColor: string;
  };
};

export type SignatureBlock = {
  id: string;
  type: "firma";
  content: {
    name: string;
    role: string;
    company: string;
    note: string;
  };
  styles: {
    accentColor: string;
  };
};

export type FooterBlock = {
  id: string;
  type: "footer";
  content: {
    companyLine: string;
    address: string;
    legal: string;
  };
  styles: {
    align: "left" | "center";
  };
};

export type EmailBlock =
  | HeroBlock
  | TextBlock
  | ImageBlock
  | CtaBlock
  | DividerBlock
  | TwoColumnsBlock
  | SignatureBlock
  | FooterBlock;

export type EmailBlockType = EmailBlock["type"];

export type EmailDocument = {
  id: string;
  title: string;
  preheader: string;
  theme: EmailTheme;
  blocks: EmailBlock[];
};

export type EmailTemplateVersion = {
  id: string;
  label: string;
  createdAt: string;
  document: EmailDocument;
};

export type EmailTemplate = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: EmailTemplateCategory;
  variante: EmailTemplateVariant;
  destacado?: boolean;
  status: EmailTemplateStatus;
  updatedAt: string;
  document: EmailDocument;
  versions: EmailTemplateVersion[];
};

export type EmailRenderData = {
  cliente: {
    nombre: string;
    empresa: string;
    email: string;
    localidad: string;
    ultimoContacto: string;
  };
  campana: {
    nombre: string;
    propuestaValor: string;
    remitente: string;
  };
  empresa: {
    nombre: string;
    web: string;
    telefono: string;
  };
};

export type BlockDefinition = {
  type: EmailBlockType;
  title: string;
  description: string;
};
