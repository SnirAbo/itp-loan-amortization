import Decimal from 'decimal.js'

export interface ComputeInput {
  principal: number
  apr: number // percent e.g., 6.5
  termYears: number
  startDate?: string
}

export interface ScheduleRow {
  month: number
  date: string // ISO date YYYY-MM-DD
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface ComputeResult {
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  apr: number
  startDate?: string
  schedule: ScheduleRow[]
}

Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

export function compute({ principal, apr, termYears, startDate }: ComputeInput): ComputeResult {
  const P = new Decimal(principal)
  const n = new Decimal(termYears).mul(12).toNumber()
  const rMonthly = new Decimal(apr).div(100).div(12)

  let payment: Decimal
  if (rMonthly.eq(0)) {
    payment = P.div(n)
  } else {
    const onePlusR = rMonthly.add(1)
    const denom = new Decimal(1).minus(onePlusR.pow(-n))
    payment = P.mul(rMonthly).div(denom)
  }
  payment = payment.toDecimalPlaces(2)

  let balance = P
  let totalInterest = new Decimal(0)
  const schedule: ScheduleRow[] = []

  const start = startDate ? new Date(startDate) : null

  for (let i = 1; i <= n; i++) {
    const interest = balance.mul(rMonthly).toDecimalPlaces(2)
    let principalPart = payment.sub(interest)

    // Last payment adjustment to reach zero balance
    if (i === n) {
      principalPart = balance
    }

    balance = balance.sub(principalPart).toDecimalPlaces(2)
    totalInterest = totalInterest.add(interest)

    const d = start ? monthAdd(start, i - 1) : null
    schedule.push({
      month: i,
      date: (d ? d : new Date()).toISOString().slice(0, 10),
      payment: payment.toNumber(),
      interest: interest.toNumber(),
      principal: principalPart.toNumber(),
      balance: balance.toNumber(),
    })
  }

  const totalPaid = payment.mul(n).toDecimalPlaces(2)

  return {
    monthlyPayment: payment.toNumber(),
    totalInterest: totalInterest.toNumber(),
    totalPaid: totalPaid.toNumber(),
    apr,
    startDate,
    schedule,
  }
}

function monthAdd(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}
