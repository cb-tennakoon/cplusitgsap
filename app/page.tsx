import BootScreen from "@/components/BootScreen";
import CrashHero from "@/components/CrashHero";
import SymptomPicker from "@/components/SymptomPicker";
import XRayExplorer from "@/components/XRayExplorer";

export default function Page() {
  return (
    <>
      <BootScreen />
      <CrashHero />
      <SymptomPicker/>
      <XRayExplorer/>
      {/* your website content */}
    </>
  );
}