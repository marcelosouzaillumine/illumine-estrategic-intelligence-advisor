import { AggregateRoot } from '../../shared';
import { 
  ContractNumber, 
  CustomerReference, 
  ContractStatus, 
  ContractOrigin, 
  ContractTerms, 
  ContractLifecycle 
} from '../value-objects/ContractValueObjects';

export interface Contract extends AggregateRoot<ContractNumber> {
  customer: CustomerReference;
  origin: ContractOrigin;
  terms: ContractTerms;
  status: ContractStatus;
  lifecycle: ContractLifecycle;
}
