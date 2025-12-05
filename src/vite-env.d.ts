/// <reference types="vite/client" />

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "@blocknote/mantine/style.css";
declare module "@blocknote/core/fonts/inter.css";

