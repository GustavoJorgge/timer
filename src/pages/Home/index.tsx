import { HandPalm, Play } from "phosphor-react"
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // utilizamos desta forma em bibliotecas que não possuem "export default"
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles'
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import { CyclesContext } from "../../contexts/CyclesContext"
import { useContext } from "react"






const newCycleFormValidationSchema = zod.object({
    task: zod.string()
        .min(1, 'Informe a tarefa'), //Primeiro parametro é a regra, segundo parametro é a mensagem
    minutesAmount: zod.number()
        .min(1, 'O ciclo precisa ser no minimo 5 minutos.').max(60, 'O ciclo precisa ser de no maximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {

    const { activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    // interface NewCycleFormData{
    //     task: string
    //     minutesAmout: number
    // }

function handleCreateNewCycle(data: NewCycleFormData){
    createNewCycle(data)

    reset()
}

    console.log(activeCycle)

    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                <FormProvider {...newCycleForm}>
                    {<NewCycleForm />}
                </FormProvider>
                <Countdown />


                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}