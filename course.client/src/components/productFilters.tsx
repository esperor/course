import ProductFiltersModel from '../models/productFiltersModel';
import EProductOrdering, {
  productOrderingMap,
} from '../models/productOrdering';
import Reset from './assets/reset';
import constant from '../utils/constants';

export default function ProductFilters({
  filters,
  onLimitChange,
  setFilters,
  onInvalidate,
}: {
  filters: ProductFiltersModel;
  onLimitChange: () => void;
  setFilters: (filters: ProductFiltersModel) => void;
  onInvalidate: () => void;
}) {
  return (
    <>
      <div className="flex flex-row items-center">
        <label className="mr-4" htmlFor="filters.search">
          Поиск:
        </label>
        <input
          type="text"
          className="w-64 h-fit"
          id="filters.search"
          value={filters.search ?? ''}
          placeholder="Рубашка мужская..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <label className="mr-4 ml-12" htmlFor="sort">
          Сортировать:
        </label>
        <select
          className="text-gray-900 h-fit"
          id="sort"
          value={filters.ordering as number}
          onChange={(e) =>
            setFilters({ ...filters, ordering: parseInt(e.target.value) })
          }
        >
          {Object.entries(productOrderingMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <button
          className="ml-auto h-fit btn px-0 bg-transparent"
          onClick={() => {
            setFilters({
              ...filters,
              ordering: EProductOrdering.None,
              search: null,
            });
            setTimeout(onInvalidate, 50);
          }}
        >
          <Reset />
        </button>
        <button
          type="button"
          className="btn ml-4"
          title="Применить фильтры"
          onClick={() => {
            onInvalidate();
            onLimitChange();
          }}
        >
          Применить
        </button>
      </div>
      <div className="flex flex-row gap-4 mt-4 items-center">
        <label htmlFor="filters.limit" className="mr-4">
          Показывать товаров:
        </label>
        <input
          type="number"
          className="w-16 h-fit"
          value={filters.limit}
          onChange={(e) =>
            setFilters({ ...filters, limit: parseInt(e.target.value) })
          }
          onBlur={() =>
            setTimeout(() => {
              onInvalidate();
              onLimitChange();
            }, 50)
          }
        />
        <button
          className="btn p-0 bg-transparent"
          title="Сбросить количество показываемых товаров"
          onClick={() => {
            setFilters({ ...filters, limit: constant.defaultLimit });
            setTimeout(() => {
              onInvalidate();
              onLimitChange();
            }, 50);
          }}
        >
          <Reset />
        </button>
      </div>
    </>
  );
}
