# object_id
A function that generates a unique id for objects

### Installation
npm or yarn
```bash
npm install object_id
yarn add object_id
```
cdn
```html
<script src="https://unpkg.com/object_id"></script>
```

### Usage
```js
import objectId from 'object_id'
const id = objectId(obj, options?)
```

#### Options
<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">Option</th>
      <th width="15%">Type</th>
      <th width="15%">Default</th>
      <th width="50%">Description</th>
    </tr>
  </thead>
  <tbody align="center">
    <tr>
      <td><code>key</code></td>
      <td>String</td>
      <td><code>'__unique_key_prop'</code></td>
      <td>The property name for id.</td>
    </tr>
    <tr>
      <td><code>enumerable</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>If the id property is enumerable.</td>
    </tr>
  </tbody>
</table>
    