import FadeWrapper from '@/components/animation/fade'
import IconPowerNap from '@/components/icon/power-nap'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { CategorySleep, useSleep } from '../hooks/sleep-provider'

const categories = [
    {
        name: 'Night Sleep',
        key: 'night-sleep',
        description: "8 hours of restful sleep for maximum earnings",
        icon: <Moon className="h-6 w-6 text-primary mb-1" />
    },
    {
        name: 'Day Nap',
        key: 'day-nap',
        description: "Perfect for afternoon recharge and bonus tokens",
        icon: <Sun className="h-6 w-6 text-primary mb-1" />
    },
    {
        name: 'Power Nap',
        key: 'power-nap',
        description: "Quick 20-minute naps for instant rewards",
        icon: <IconPowerNap className="h-6 w-6 text-primary mb-1" />
    }
]

export default function ChooseCategory() {
    const { setData, setStep, data } = useSleep()

    function handleChooseCategory(key: CategorySleep) {
        setData({...data, category: key})
        setStep('confirm')
    }
    return (
        <FadeWrapper className="grid grid-cols-1 gap-4">
            <h2 className='text-2xl font-bold mb-6'>Choose Your Categories</h2>
            <AnimatePresence>
                {categories.map((category, index) => (
                    <FadeWrapper key={`cetegory-sleep-${index}`} delay={(index + 1) * 0.3}>
                        <Card role='button' className="cursor-pointer hover:border-primary border border-transparent" onClick={() => handleChooseCategory(category.key as CategorySleep)}>
                            <CardHeader>
                                {category.icon}
                                <h3 className="font-bold text-xl">{category.name}</h3>
                            </CardHeader>
                            <CardContent>{category.description}</CardContent>
                        </Card>
                    </FadeWrapper>
                ))}
            </AnimatePresence>
        </FadeWrapper>
    )
}