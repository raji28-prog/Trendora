import { useSelector, useDispatch } from 'react-redux';
import {
  selectBusinesses,
  selectSelectedBusinessId,
  selectSelectedBusiness,
  selectBusinessLoading,
  setSelectedBusiness,
} from './businessSlice.js';

/**
 * Convenience hook for consuming the global business selection state.
 * Returns:
 *  - businesses: full list
 *  - selectedBusinessId: currently selected ID (or null)
 *  - selectedBusiness: full object for selected ID (or null)
 *  - loading: whether businesses are being fetched
 *  - setSelected: dispatch helper to change the selected business
 */
export function useSelectedBusiness() {
  const dispatch = useDispatch();
  const businesses = useSelector(selectBusinesses);
  const selectedBusinessId = useSelector(selectSelectedBusinessId);
  const selectedBusiness = useSelector(selectSelectedBusiness);
  const loading = useSelector(selectBusinessLoading);

  const setSelected = (id) => {
    dispatch(setSelectedBusiness(id));
  };

  return { businesses, selectedBusinessId, selectedBusiness, loading, setSelected };
}
