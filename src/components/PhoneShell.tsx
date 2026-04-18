import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface Props {
  children: ReactNode;
  hideNav?: boolean;
}

export const PhoneShell = ({ children, hideNav }: Props) => {
  return (
    <div className="min-h-screen w-full bg-gradient-mesh bg-background flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-background relative overflow-hidden">
        <div className="pb-28 min-h-screen">{children}</div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};
