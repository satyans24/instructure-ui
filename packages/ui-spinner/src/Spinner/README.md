---
describes: Spinner
---

```js
---
guidelines: true
---
<Guidelines>
  <Figure title="Upgrade Notes for v8.0.0" recommendation="none">
    <Figure.Item>
      The <code>title</code> prop will be removed. Use <code>renderTitle</code> instead.
    </Figure.Item>
  </Figure>
</Guidelines>
```

### Choose from four sizes and add margin as needed

The `size` prop allows you to select from `x-small`, `small`, `medium` and `large`
-sized spinners. Margin can be added as needed using the `margin` prop.

```js
---
example: true
---
<div>
  <Spinner renderTitle="Loading" size="x-small" />
  <Spinner renderTitle="Loading" size="small" margin="0 0 0 medium" />
  <Spinner renderTitle="Loading" margin="0 0 0 medium" />
  <Spinner renderTitle="Loading" size="large" margin="0 0 0 medium" />
</div>
```

### Different color schemes for use with light and dark backgrounds

Spinner provides an `inverse` color scheme designed to be used with
dark backgrounds.

```js
---
example: true
background: 'checkerboard-inverse'
---
<Spinner renderTitle="Loading" variant="inverse" />
```

### Screen reader support

The `renderTitle` prop is read to screen readers.

```js
---
example: true
---
<Spinner renderTitle={() => "Hello world"} />
```

### Internet Explorer

Internet Explorer doesn't support animations inside inline SVGs.
IE users will simply see a rotating circle, minus the "morphing" of the spinner.
