import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Modal({ children, title, description, open, onOpenChange }: { children: React.ReactNode, title?: string, description?: string, open: boolean, onOpenChange: any }) {

    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {!!description && <DialogDescription>
                            {description}
                        </DialogDescription>}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    {!!description && <DrawerDescription>
                        {description}
                    </DrawerDescription>}
                </DrawerHeader>
                <div className="p-4">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
