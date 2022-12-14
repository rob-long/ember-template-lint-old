# no-unnecessary-component-helper

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

The `component` template helper can be used to dynamically pick the component being rendered based on the provided property. But if the component name is passed as a string because it's already known, then the component should be invoked directly, instead of using the `component` helper.

## Examples

This rule **forbids** the following:

```hbs
{{component "my-component"}}
```

This rule **allows** the following:

```hbs
{{component SOME_COMPONENT_NAME}}
```

```hbs
{{!-- the `component` helper is needed to invoke this  --}}
{{component "addon-name@component-name"}}
```

```hbs
{{my-component}}
```

```hbs
{{my-component close=(component "link-to" "index")}}
<MyComponent @close={{component "link-to" "index"}} />
```

## References

* [component helper guide](https://guides.emberjs.com/release/components/defining-a-component/#toc_dynamically-rendering-a-component)
* [component helper spec](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component)
