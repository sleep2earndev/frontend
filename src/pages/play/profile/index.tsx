import { logout } from '@/api/user';
import FadeWrapper from '@/components/animation/fade'
import { useLoading } from '@/components/loading-provider';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { useMutation } from '@tanstack/react-query';
import { Bell, ChevronRight, Clock, LogOut, Settings, Shield } from 'lucide-react'

import { motion } from "motion/react";
import { useState } from 'react';
import { toast } from 'sonner';

const comingSoonSections = [

  {
    icon: <Bell className="h-5 w-5 text-secondary" />,
    title: "Notifications",
    description: "Configure your notification preferences",
  },
  {
    icon: <Shield className="h-5 w-5 text-accent" />,
    title: "Security",
    description: "Protect your account and assets",
  },
  {
    icon: <Clock className="h-5 w-5 text-emerald-500" />,
    title: "Sleep History",
    description: "View your past sleep sessions",
  },
  {
    icon: <Settings className="h-5 w-5 text-orange-500" />,
    title: "App Settings",
    description: "Customize your app experience",
  },
]

export default function ProfilePage() {
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const { setLoading } = useLoading()
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess() {
      window.location.href = '/'
    },
    onError(error) {
      setLoading(false)
      console.warn(error);
      toast.error("Get earning data failed, please try again");
    }
  })
  function handleLogout() {
    setLogoutConfirm(false)
    setLoading(true)
    mutate()
  }
  return (
    <FadeWrapper className="flex-1">

      {/* Coming Soon Sections */}
      <div className="space-y-4 p-4">
        {comingSoonSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 bg-muted/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-xs text-foreground/60">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">Coming Soon</span>
                    <ChevronRight className="h-4 w-4 text-foreground/40" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Button
            variant="ghost"
            className="mt-4 w-full border-2 border-destructive/20 py-6 text-destructive hover:bg-destructive/10"
            onClick={() => setLogoutConfirm(true)}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </motion.div>
      </div>
      {/* Logout Confirmation Dialog */}
      <Modal title="Confirm Logout" open={logoutConfirm} onOpenChange={setLogoutConfirm}>
        <div className="border-0 bg-background/95 text-foreground backdrop-blur-md">

          <p className="text-foreground/70">
            Are you sure you want to log out of your account?
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-foreground/10 bg-muted/30 hover:bg-muted/50"
              onClick={() => setLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant={'ghost'}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </FadeWrapper>
  )
}
