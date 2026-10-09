import BootScreen from "@/components/BootScreen";
import CrashHero from "@/components/CrashHero";
import SymptomPicker from "@/components/SymptomPicker";
import XRayExplorer from "@/components/XRayExplorer";
import RepairTracker from '@/components/RepairTracker';
import Liverepairlog  from '@/components/Liverepairlog';
import Systemstatusfooter  from '@/components/Systemstatusfooter';
import Siteheader  from '@/components/Siteheader';
import ChatBookingPro  from '@/components/ChatBookingPro';
import Trythisfirst   from '@/components/Trythisfirst';

export default function Page() {
  return (
    <>
      <Siteheader/>
      <BootScreen />
      <CrashHero />
      <SymptomPicker/>
      <XRayExplorer/>
      <RepairTracker />
      {/* <Liverepairlog /> */}
      <Trythisfirst/>
      <ChatBookingPro/>
      <Systemstatusfooter/>

      {/* your website content */}
    </>
  );
}