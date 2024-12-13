import type { Route } from "./+types/home";
import { ViewPaste } from "../viewPaste/viewPaste";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Encryptify - View Paste" }];
}

export default function Paste() {
    return <ViewPaste />;
}
