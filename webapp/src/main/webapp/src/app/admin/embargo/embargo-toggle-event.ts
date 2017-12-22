import { Embargo } from "./embargo";
import { Toggle } from "./toggle.component";
import { EmbargoScope } from "./embargo-scope.enum";

/**
 * Holds all information necessary to present the user with a confirmation modal regarding their toggle selection
 */
export interface EmbargoToggleEvent {

  /**
   * The toggle clicked to initiate the event
   */
  readonly toggle: Toggle;

  /**
   * The desired value of the toggle
   */
  readonly value: boolean;

  /**
   * The scope of the embargo being toggled
   */
  readonly scope: EmbargoScope;

  /**
   * The embargo being changed
   */
  readonly embargo: Embargo;

  /**
   * True if the embargo for the given scope is enabled
   */
  readonly embargoEnabled: boolean;

  /**
   * The state embargo in the case that the embargo is a district embargo
   */
  readonly overridingEmbargo: Embargo;

  /**
   * True if there is an overriding embargo and its embargo for the given scope is enabled
   */
  readonly overridingEmbargoEnabled: boolean;

}
