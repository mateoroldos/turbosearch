# 🚀 TurboSearch

A lightning-fast, keyboard-driven search interface that lets you search across multiple engines simultaneously. Built with SvelteKit and designed for power users.

![TurboSearch Demo](./demo.gif)

## ✨ Features

- 🔍 **Multi-Engine Search**: Search across multiple engines simultaneously
- ⌨️ **Keyboard-First**: Efficient keyboard shortcuts for everything
- 🎯 **Smart Commands**: Quick commands with @ and # prefixes
- 🎨 **Themes**: Light and dark mode support
- 📱 **Responsive**: Works great on all devices
- ⚡ **Fast**: Instant search suggestions and results
- 🔧 **Customizable**: Add your own search engines and categories

## 🎯 Quick Commands

- `@engine`: Search using a specific engine
- `#group`: Search across all engines in a group
- `@engine #group`: Combine commands for precise searching
- `/`: Focus the search bar
- `Esc`: Exit search mode

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mateoroldos/turbosearch.git
cd turbosearch
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Built With

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons
- [shadcn-svelte](https://www.shadcn-svelte.com/) - UI Components

## 🔧 Configuration

### Adding Custom Search Engines

1. Go to the Integrations page
2. Click "Add Engine"
3. Choose from available integrations or add a custom one
4. Configure shortcuts and categories

### Setting as New Tab Page

#### Chrome

1. Install the "New Tab Redirect" extension
2. Set the URL to your TurboSearch instance
3. Open a new tab to start searching

#### Firefox

1. Install the "New Tab Override" extension
2. Configure it to open TurboSearch
3. Enjoy faster searching in every new tab

## 🌟 Usage Examples

```typescript
// Search on Google and GitHub simultaneously
'svelte kit documentation @google @github';

// Search across all development-related engines
'rust programming #dev';

// Combine categories and specific engines
'design patterns #dev @stackoverflow';
```

## 🛣️ Roadmap

- [ ] Custom themes support
- [ ] Search history
- [ ] Sync settings across devices
- [ ] More keyboard shortcuts
- [ ] Browser extensions

## 📝 License

This project is licensed under the APG-3.0 License - see the [AP](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [DuckDuckGo](https://duckduckgo.com/)
- Icons from [Lucide](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
