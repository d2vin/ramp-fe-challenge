import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 5

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: mockData.employees,
  transactions: mockData.transactions,
}

export const getEmployees = (): Employee[] => data.employees

export const getTransactionsPaginated = ({
  page,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null")
  }
  // declared start and end then handled case where page # is 0
  let start, end
  if (page === 0) {
    start = page * TRANSACTIONS_PER_PAGE
    end = TRANSACTIONS_PER_PAGE
  } else {
    start = 0
    end = page * TRANSACTIONS_PER_PAGE
  }

  if (start > data.transactions.length) {
    throw new Error(`Invalid page ${page}`)
  }

  // returned page instead of null
  const nextPage = end < data.transactions.length ? page + 1 : page

  // returned page
  return {
    page,
    nextPage,
    data: data.transactions.slice(start, end),
  }
}

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    // replaced error message with a return of the transactions
    return data.transactions
  }

  return data.transactions.filter((transaction) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, value }: SetTransactionApprovalParams): void => {
  const transaction = data.transactions.find(
    (currentTransaction) => currentTransaction.id === transactionId
  )

  if (!transaction) {
    throw new Error("Invalid transaction to approve")
  }

  transaction.approved = value
}
