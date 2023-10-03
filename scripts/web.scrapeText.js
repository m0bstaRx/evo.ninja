const result = __wrap_subinvoke(
  "plugin/webscrape",
  "findText",
  { stringsToFind, url }
)
if (!result.ok) {
  throw result.error;
}
return result.value;
