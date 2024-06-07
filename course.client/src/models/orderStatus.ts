enum EOrderStatus {
  Created = 0,
  Assigned = 1,
  Done = 2,
  Canceled = 3,
}

export function orderStatusToString(status: EOrderStatus) {
  switch (status) {
    case EOrderStatus.Created:
      return "Создан";
    case EOrderStatus.Assigned:
      return "Назначен";
    case EOrderStatus.Done:
      return "Выполнен";
    case EOrderStatus.Canceled:
      return "Отменен";
  }
};

export default EOrderStatus;