import { useEffect } from "react";

const title = "Are you sure you want to leave this page?";
// const subtitle =
//     "You have unsaved changes that will be lost if you leave this page.";

export default function useLeaveConfirmation({ isBlocked }: { isBlocked: boolean }) {

    useEffect(() => {
        // Handle page reload
        const handleRouteChange = (event: BeforeUnloadEvent) => {
            if (isBlocked) {
                event.preventDefault();
                event.returnValue = title;
                return title;
            }
        };

        if (isBlocked) {
            window.addEventListener("beforeunload", handleRouteChange);
        } else {
            window.removeEventListener("beforeunload", handleRouteChange);
        }

        return () => {
            window.removeEventListener("beforeunload", handleRouteChange);
        };
    }, [isBlocked]);
}
