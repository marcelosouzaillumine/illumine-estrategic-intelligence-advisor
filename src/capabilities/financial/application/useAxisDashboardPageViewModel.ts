import { useAxisDashboardViewModel } from '../../../viewmodels/useAxisDashboardViewModel';

export function useAxisDashboardPageViewModel(props?: any) {
  const vm = useAxisDashboardViewModel(props);
  return {
    state: vm.state,
    computed: vm.computed,
    actions: vm.actions
  };
}
