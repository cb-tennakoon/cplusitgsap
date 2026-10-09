import BootScreen from "@/components/BootScreen";
import CrashHero from "@/components/CrashHero";
import SymptomPicker from "@/components/SymptomPicker";
import XRayExplorer from "@/components/XRayExplorer";
import RepairTracker from '@/components/RepairTracker';
import Liverepairlog  from '@/components/Liverepairlog';
import Systemstatusfooter  from '@/components/Systemstatusfooter';
import Siteheader  from '@/components/Siteheader';

export default function Page() {
  return (
    <>
      <Siteheader/>
      <BootScreen />
      <CrashHero />
      <SymptomPicker/>
      <XRayExplorer/>
      <RepairTracker />
      <Liverepairlog />
      <Systemstatusfooter/>

      {/* your website content */}
    </>
  );
}