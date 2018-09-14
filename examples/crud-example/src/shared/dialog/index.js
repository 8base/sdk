import { Dialog as PureDialog } from '@8base/boost';

import { DialogProvider } from './DialogProvider';
import { withDialog } from './withDialog';
import { withDialogState } from './withDialogState';

const Dialog = {
  ...PureDialog,
  Plate: withDialogState(PureDialog.Plate),
};

export { Dialog, withDialog, DialogProvider };
