import classnames from "classnames"
import getQuestions from "app/play/queries/getQuestions"
import Layout from "app/core/layouts/Layout"
import useQuiz from "app/play/hooks/useQuiz"
import { BlitzPage, useQuery, useRouter } from "blitz"
import { StepOne, StepThree, StepTwo } from "app/play/components/Steps"
import { SUBJECT } from "@prisma/client"
import { Suspense, useState } from "react"

type StepsProps = React.ComponentProps<typeof StepOne> &
  React.ComponentProps<typeof StepTwo> &
  React.ComponentProps<typeof StepThree>

const STEPS_HASH: React.ComponentType<StepsProps>[] = [StepOne, StepTwo, StepThree]

const QuizComponent = () => {
  const router = useRouter()

  const [activeStep, setActiveStep] = useState<number>(1)
  const { sid } = router.query
  const [questions] = useQuery(getQuestions, { where: { subject: sid as SUBJECT } })

  const CurrentComponent = (sid && STEPS_HASH[activeStep - 1]) || StepOne
  const useQuizResult = useQuiz({ questions, setActiveStep })

  return (
    <div>
      {CurrentComponent && (
        <CurrentComponent
          setActiveStep={setActiveStep}
          questions={questions}
          useQuizResult={useQuizResult}
        />
      )}
    </div>
  )
}
const Play: BlitzPage = () => {
  return (
    <main role="main">
      <h1>Playing</h1>
      {/* <Dot bgColor="danger" />
      <Dot />
      <Dot bgColor="success" />
      <Dot size={45} />
      <Dot /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <QuizComponent />
      </Suspense>
    </main>
  )
}

Play.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Play