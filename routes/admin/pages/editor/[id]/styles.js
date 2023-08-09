import { View } from "@ulibs/ui";

const style = `
  <style>
  [u-cloak] {display: none;}

  .item {
    display: contents;
  }

  .item > :not(.placeholder) {
    
    transition: all 0.2s ease;
    position: relative;
    min-height: var(--size-lg);
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
  }

  .item.cut > :not(.content-menu) {
    opacity: 0.5;
    border: 1px solid var(--color-base-400);
  }

  .item.copy > :not(.content-menu) {
    border: 1px solid var(--color-primary-300);
  }

  .item > :not(.placeholder):hover {
    border: 1px dashed var(--color-primary-400);
    
  }
  .item.active > :not(.placeholder) {
    border: 1px solid var(--color-primary-500);
    background-color: var(--color-primary-100);
  }
  
  .placeholder {
    transition: all 0.2s ease;
    min-width: var(--size-sm);
    background-image: repeating-linear-gradient(45deg, var(--color-base-300), var(--color-base-300) 2px,var(--color-primary-100) 2px,var(--color-primary-100) 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-md);
    gap: var(--size-xs);
    border: 1px dashed var(--color-primary-200);
    opacity: 1;
    width: 100%;

  }

  .placeholder-md {
    height: var(--size-xl);
  }

  .placeholder-sm {
    height: 0;
    display: none;

  }

  .item.active  > .placeholder-sm {
    height: calc(var(--size-sm));
    border: 1px solid var(--color-primary-200);
    top: 0;
    bottom: 0;
  }

  .item.active  > .placeholder-sm.placeholder-before {
    bottom: calc(100% + 1px);
    top: auto;
    left: -1px;
    right: -1px;
  }

  .item.active > .placeholder-sm.placeholder-after {
    left: -1px;
    right: -1px;
    bottom: auto;
    top: calc(100% + 1px);
  }

  .placeholder-slot {
    min-height: var(--size-xl);
  }

  .placeholder.active {
    border: 1px solid var(--color-primary-500);
  }
  
  .component-item {
  
  }
  .component-item.active {
    border: 1px solid var(--color-primary-300);
  }
  
  .component-item.active {
    border: 1px solid var(--color-primary-500);
    background-color: var(--color-base-300);
  }
  </style>
  
  `;

export function Styles() {
  return View({ htmlHead: style });
}
