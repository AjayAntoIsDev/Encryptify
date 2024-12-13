import type { Route } from "./+types/home";
import { NewPaste } from "../newPaste/newPaste";

export function meta({}: Route.MetaArgs) {
  return [
      { title: "Encryptify - New Paste " },
  ];
}

export default function Home() {
  return <NewPaste />;
}
