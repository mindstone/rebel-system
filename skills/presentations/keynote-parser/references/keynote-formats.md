# Keynote File Formats Reference

Apple Keynote has used different file formats over the years. This document describes each format and how to identify them.

## Format Detection

```
.key file
├── Is it a directory?
│   ├── Contains Index.zip     → TRANSITIONAL (iWork '13 era)
│   ├── Contains index.apxl    → OLD XML (Keynote 1-5)
│   └── Contains presentation.apxl → OLD XML (variant)
│
└── Is it a ZIP file?
    ├── Contains *.iwa files   → MODERN IWA (Keynote 13+)
    └── Contains Index.zip     → TRANSITIONAL (nested)
```

## Format Details

### Modern IWA Format (2013+, Keynote 10+)

- **File type**: ZIP archive
- **Internal structure**: Snappy-compressed Protocol Buffer files
- **Key files**:
  - `Index/Document.iwa` - Main document
  - `Index/Slide*.iwa` - Individual slides
  - `Data/` - Media assets

**Text location**: `TSWP.StorageArchive` protobuf messages contain text arrays.

**Tools**: `keynote-parser` (Python), `keynote-parser2` (Node.js)

### Transitional Format (iWork '13 era, Keynote 6-9)

- **File type**: macOS package (directory)
- **Internal structure**: ZIP + assets
- **Key files**:
  - `Index.zip` - Contains IWA protobuf files
  - `Data/` - Media assets
  - `Metadata/` - Property lists

**Parsing**: Extract Index.zip and parse as modern format.

### Old XML Format (Pre-2009, Keynote 1-5)

- **File type**: macOS package (directory)
- **Internal structure**: XML files
- **Key files**:
  - `index.apxl` or `presentation.apxl` - Main XML
  - Various resource files

**Text location**: Standard XML elements, can be parsed with lxml/ElementTree.

**Documentation**: Apple Technical Note TN2067 (archived)

## Protobuf Schema

Modern Keynote files use Protocol Buffers with Snappy compression. The schema is:
- **Not publicly documented** by Apple
- **Reverse-engineered** by the community
- **Changes with each Keynote version**

Key protobuf types for text:
- `TSWP.StorageArchive` - Contains `text` string array
- `TSP.Reference` - Links between objects
- `KN.SlideArchive` - Slide structure

## Cross-Platform Considerations

| Format | macOS | Windows | Linux |
|--------|-------|---------|-------|
| Modern IWA | ✅ Full | ✅ With snappy lib | ✅ With snappy lib |
| Transitional | ✅ Full | ⚠️ Rare | ⚠️ Rare |
| Old XML | ✅ Full | ⚠️ Packages are directories | ⚠️ Packages are directories |

Old format files are macOS "bundles" (special directories). When copied to Windows/Linux, they become regular directories. Parsing still works, but the `.key` extension may not be preserved.

## Resources

- [obriensp/iWorkFileFormat](https://github.com/obriensp/iWorkFileFormat) - Original reverse engineering
- [SheetJS IWA Notes](https://oss.sheetjs.com/notes/iwa/) - Technical documentation
- [psobot/keynote-parser](https://github.com/psobot/keynote-parser) - Python parser
- [meteorlxy/keynote-parser](https://github.com/meteorlxy/keynote-parser) - Node.js parser
