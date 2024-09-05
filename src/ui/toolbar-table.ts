import Quill from 'quill';
import tableIcon from '../assets/icon/table.svg';

const Inline = Quill.import('blots/inline');
const icons = Quill.import('ui/icons');
icons['table-better'] = tableIcon;
const SUM = 10;

class ToolbarTable extends Inline {
  static computeChildren: Element[] = [];

  static clearSelected(children: Element[]) {
    for (const child of children) {
      child.classList && child.classList.remove('ql-cell-selected');
    }
  }

  static createContainer(quillInstance:any) {
    const container = document.createElement('div');
    const list = document.createElement('div');
    const label = document.createElement('div');
    const fragment = document.createDocumentFragment();
    for (let row = 1; row <= SUM; row++) {
      for (let column = 1; column <= SUM; column++) {
        const child = document.createElement('span');
        child.setAttribute('row', `${row}`);
        child.setAttribute('column', `${column}`);
        fragment.appendChild(child);
      }
    }
    label.innerHTML = '0 x 0';
    container.classList.add('ql-table-select-container', 'ql-hidden');
    list.classList.add('ql-table-select-list');
    label.classList.add('ql-table-select-label');
    list.appendChild(fragment);
    container.appendChild(list);
    container.appendChild(label);
    container.addEventListener('mousemove', e => this.handleMouseMove(e, container));
    quillInstance.container.appendChild(container);
    quillInstance.tableSelectContainer = container;
    return container;
  }

  static getComputeChildren(children: Element[], e: MouseEvent): Element[] {
    const computeChildren = [];
    const { clientX, clientY } = e;
    for (const child of children) {
      const { left, top } = child.getBoundingClientRect();
      if (clientX >= left && clientY >= top) {
        computeChildren.push(child);
      }
    }
    return computeChildren;
  }

  static getSelectAttrs(element: Element) {
    const row = ~~element.getAttribute('row');
    const column = ~~element.getAttribute('column');
    return [row, column];
  }

  static handleClick(e: MouseEvent, quillInstance:any, insertTable: _insertTable) {
    const container = quillInstance.tableSelectContainer;
    this.toggle(container);
    const span = (e.target as Element).closest('span[row]');
    if (!span) {
      const child = this.computeChildren[this.computeChildren.length - 1];
      if (child) this.insertTable(child, insertTable, quillInstance);
      return;
    }
    this.insertTable(span, insertTable, quillInstance);
  }

  static handleMouseMove(e: MouseEvent, container: Element) {
    const children = container.firstElementChild.children;
    // @ts-ignore
    this.clearSelected(children);
    // @ts-ignore
    const computeChildren = this.getComputeChildren(children, e);
    for (const child of computeChildren) {
      child.classList && child.classList.add('ql-cell-selected');
    }
    this.computeChildren = computeChildren;
    this.setLabelContent(container.lastElementChild, computeChildren[computeChildren.length - 1]);
  }

  static hide(element: Element) {
    element && element.classList.add('ql-hidden');
  }

  static insertTable(child: Element, insertTable: _insertTable, quillInstance:any) {
    const [row, column] = this.getSelectAttrs(child);
    insertTable(row, column);
    const container = quillInstance.tableSelectContainer;
    this.clearSelected(container.firstElementChild.children);
    this.hide(container);
    this.computeChildren = [];
  }

  static setLabelContent(label: Element, child: Element) {
    if (!child) {
      label.innerHTML = '0 x 0';
    } else {
      const [row, column] = this.getSelectAttrs(child);
      label.innerHTML = `${row} x ${column}`;
    }
  }

  static show(element: Element) {
    element && element.classList.remove('ql-hidden');
  }

  static toggle(element: Element) {
    element && element.classList.toggle('ql-hidden');
  }
};

export default ToolbarTable;
