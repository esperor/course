import Trash from '#/components/assets/trash';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

export type PropertiesEditorRef = { reset: () => void };
type PropertiesEditorProps = {
  properties: Record<string, string>;
  onChange: (updatedProperties: Record<string, string>) => void;
};

const PropertiesEditor = forwardRef<PropertiesEditorRef, PropertiesEditorProps>(
  ({ properties, onChange }, ref) => {
    const modifyProperties = useCallback((properties: Record<string, string>) => {
      return Object.entries(properties).map((property) => ({
        id: property[0],
        key: property[0],
        value: property[1],
      }));
    }, []);

    const [propertiesWithId, setPropertiesWithId] = useState(() => modifyProperties(properties));

    useImperativeHandle(
      ref,
      () => ({
        reset: () => setPropertiesWithId(modifyProperties(properties)),
      }),
      [modifyProperties, properties],
    );

    const handlePropertyChange = (id: string, key: string, value: string) => {
      setPropertiesWithId((prev) => {
        return prev.map((property) => {
          if (property.id === id) {
            property.key = key;
            property.value = value;
          }
          return property;
        });
      });
    };

    const handlePropertyRemove = (id: string) => {
      setPropertiesWithId((prev) => prev.filter((property) => property.id !== id));
    };
    const handlePropertyAdd = () => {
      setPropertiesWithId([...propertiesWithId, { id: Date.now().toString(), key: '', value: '' }]);
    };

    useEffect(() => {
      onChange(
        propertiesWithId.reduce(
          (acc, property) => ({ ...acc, [property.key]: property.value }),
          {},
        ),
      );
    }, [propertiesWithId]);

    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Значение</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {propertiesWithId.map(({ id, key, value }) => (
            <tr key={id}>
              <td className="!p-0">
                <input
                  className="transparent w-full"
                  type="text"
                  value={key}
                  onChange={(e) => handlePropertyChange(id, e.target.value, value)}
                />
              </td>
              <td className="!p-0">
                <input
                  className="transparent w-full"
                  type="text"
                  value={value}
                  onChange={(e) => handlePropertyChange(id, key, e.target.value)}
                />
              </td>
              <td className="!p-0">
                <button
                  type="button"
                  className={`transition-[opacity] p-1 ease-in-out duration-[200ms] delay-100 w-fit active:scale-[0.9_!important] scale-100`}
                  onClick={() => handlePropertyRemove(id)}
                >
                  <Trash className="size-5" />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={999}>
              <button
                className="w-full px-4 relative text-transparent justify-center items-center"
                type="button"
                onClick={handlePropertyAdd}
              >
                +
                <div className="bg-slate-200 w-[2px] h-[1rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="bg-slate-200 w-[2px] h-[1rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

export default PropertiesEditor;
