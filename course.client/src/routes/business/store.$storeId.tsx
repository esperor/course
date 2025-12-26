import { createFileRoute } from '@tanstack/react-router'
import { authenticate } from '../../utils/http'

export const Route = createFileRoute('/business/store/$storeId')({
  component: RouteComponent,
  beforeLoad: authenticate,
})

function RouteComponent() {
  return <div>Hello "/business/store/$storeId"!</div>
}
