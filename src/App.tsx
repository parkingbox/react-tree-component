import { useMemo } from "react";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItem,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";

interface RawTreeNode {
  text: string;
  cid: string;
  gtype: string;
  default: number;
  expanded: string;
  iconCls?: string;
  _kind?: string;
  _parent?: string;
  children: RawTreeNode[];
}

interface TreeItemData {
  name: string;
  icon?: string;
}

type TreeItemsMap<T> = Record<string, TreeItem<T>>;

const rawData: RawTreeNode = JSON.parse(import.meta.env.VITE_RAW_DATA);

const transformTreeData = (data: RawTreeNode): TreeItemsMap<TreeItemData> => {
  const items: TreeItemsMap<TreeItemData> = {};
  const traverse = (paramsData: RawTreeNode) => {
    const { cid, text, children, iconCls } = paramsData;

    items[cid] = {
      index: cid,
      data: {
        name: text,
        icon: iconCls,
      },
      children: children.map((child) => child.cid),
      isFolder: children.length > 0,
    };

    children.forEach((child) => traverse(child));
  };

  traverse(data);

  return items;
};


const App = () => {  
  const treeData = useMemo(() => transformTreeData(rawData), [rawData]);
  return (
    <div className='tree'>
      <ControlledTreeEnvironment<TreeItemData>
        items={treeData}
        canDragAndDrop={true}
        getItemTitle={(item: TreeItem<TreeItemData>) => item.data.name}
        viewState={{
          "root": {
            expandedItems: [rawData.cid],
          },
        }}
      >
        <Tree treeId="root" rootItem={rawData.cid} />
      </ControlledTreeEnvironment>
    </div>
  );
};

export default App;
