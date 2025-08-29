import { Header } from "@/components/header"
import { SerpAPISearch } from "@/components/serpapi-search"
import { Footer } from "@/components/footer"

export default function SerpAPIDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SerpAPI Integration Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience real-time Google search and news search with intelligent quota management. 
            Limited to 250 searches per month on the free plan.
          </p>
        </div>
        
        <SerpAPISearch />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Google Search</h3>
              <p className="text-muted-foreground">
                Search the entire web with real-time results. Get organic search results 
                with titles, snippets, and direct links to websites.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">News Search</h3>
              <p className="text-muted-foreground">
                Find the latest news articles from around the web. Get real-time news 
                with source attribution and publication dates.
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Quota Management</h3>
            <p className="text-muted-foreground mb-4">
              The system automatically tracks your search usage and prevents exceeding 
              the monthly limit. Quota resets on the 1st of each month.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time quota tracking</li>
              <li>• Automatic monthly reset</li>
              <li>• Visual progress indicators</li>
              <li>• Low quota warnings</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
