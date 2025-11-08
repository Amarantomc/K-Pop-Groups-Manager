import { useEffect, useState } from 'react';
import type { Field, FieldOption } from '../formSource';

type OptionsMap = Record<string, FieldOption[]>;
type LoadingMap = Record<string, boolean>;
type ErrorMap = Record<string, string | null>;

// Hook para obtener opciones dinámicas declaradas en los campos (optionsEndpoint)
export function useFieldOptions(fields: Field[]) {
  const [optionsMap, setOptionsMap] = useState<OptionsMap>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});
  const [errorMap, setErrorMap] = useState<ErrorMap>({});

  useEffect(() => {
    let mounted = true;

    fields.forEach(field => {
      const endpoint = field.optionsEndpoint;
      if (!endpoint) return;

      // marcar como loading
      setLoadingMap(prev => ({ ...prev, [field.name]: true }));
      setErrorMap(prev => ({ ...prev, [field.name]: null }));

      fetch(endpoint)
        .then(async res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          const body = await res.json();
          let opts: FieldOption[] = [];
          if (Array.isArray(body) && body.length > 0) {
            if (typeof body[0] === 'string') opts = (body as string[]).map(s => ({ value: s, label: String(s) }));
            else if (body[0] && typeof body[0] === 'object' && 'value' in body[0]) opts = body as FieldOption[];
          }
          if (!mounted) return;
          setOptionsMap(prev => ({ ...prev, [field.name]: opts }));
        })
        .catch(err => {
          console.warn('useFieldOptions: error loading', field.name, err);
          if (!mounted) return;
          setErrorMap(prev => ({ ...prev, [field.name]: String(err) }));
          setOptionsMap(prev => ({ ...prev, [field.name]: [] }));
        })
        .finally(() => {
          if (!mounted) return;
          setLoadingMap(prev => ({ ...prev, [field.name]: false }));
        });
    });

    return () => { mounted = false; };
  }, [fields]);

  return { optionsMap, loadingMap, errorMap } as const;
}
