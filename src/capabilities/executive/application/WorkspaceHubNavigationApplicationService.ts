import { NavigateFunction } from 'react-router-dom';
import { InstitutionalNavigationService } from '../../../core/navigation/InstitutionalNavigationService';
import { InstitutionalNavigationReference } from '../../../types/intelligence/InstitutionalNavigationReference';

export class WorkspaceHubNavigationApplicationService {
  public static navigate(navigate: NavigateFunction, ref: InstitutionalNavigationReference): void {
    InstitutionalNavigationService.navigate(navigate, ref);
  }
}
