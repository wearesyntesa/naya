import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Naya - Keystatic Admin UI",
  description: "Keystatic Admin UI for Naya",
};

export default function Layout() {
  return <KeystaticApp />;
}
