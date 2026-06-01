import { lazy, Suspense } from 'react';
import type { CDataGridProps } from '../../dbProps';
import DataGridSkeleton from './Skeleton';

const CDataGrid = lazy(() => import('./index'));

export default function LazyCDataGrid(props: CDataGridProps) {
  return (
    <Suspense fallback={<DataGridSkeleton height={props.height as string | number} />}>
      <CDataGrid {...props} />
    </Suspense>
  );
}
