export const getCurrentPageSelection = (): readonly SceneNode[] => {
  try {
    return figma.currentPage.selection;
  } catch (error) {
    return [];
  }
};
