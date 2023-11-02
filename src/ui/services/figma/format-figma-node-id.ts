// remove any non-alphabetical or non-numeric characters
export const formatPolychromNodeId = (id: string): string =>
  id.replace(/[^a-z0-9]/gi, '');
