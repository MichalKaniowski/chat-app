import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopSidebar>{children}</DesktopSidebar>
      <MobileFooter>{children}</MobileFooter>
    </>
  );
}
