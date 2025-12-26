import { createFileRoute } from '@tanstack/react-router'
import { authenticate } from '../../utils/http'

export const Route = createFileRoute('/business/store/$storeId')({
  component: BusinessStore,
  beforeLoad: authenticate,
})

function BusinessStore() {
  return <div>Hello "/business/store/$storeId"!</div>
}
