import { ReactElement } from "react";
import { Button } from "@/components/ui/button";
 
export default function SocialLoginButton({
  providerIcon,
  message,
  onClick,
}: {
  providerIcon: ReactElement;
  message: string;
  onClick?:() => Promise<void>  // Add onClick event handler for the button.
}) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-4 "
      onClick={onClick}
     >
      {providerIcon} <p>{message}</p>
    </Button>
  );
}