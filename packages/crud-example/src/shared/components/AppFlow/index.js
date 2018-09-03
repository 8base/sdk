import { AppFlowContent } from './AppFlowContent';
import { AppFlowNav } from './AppFlowNav';
import { AppFlowNavItem } from './AppFlowNavItem';
import { AppFlowPlate } from './AppFlowPlate';

const AppFlow = {
  Content: AppFlowContent,
  Nav: {
    Plate: AppFlowNav,
    Item: AppFlowNavItem,
  },
  Plate: AppFlowPlate,
};

export { AppFlow };
