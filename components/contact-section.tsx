import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Users, ExternalLink } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-16 px-4 bg-slate-900/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-200 mb-4">Get in Touch</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Need help or have questions? Our admin team is here to assist you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-slate-200">Discord</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">
                Join our community Discord server for real-time support and chat with other players.
              </p>
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                Join Discord
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-slate-200">Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">Send us an email for detailed support or business inquiries.</p>
              <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                support@auroramc.net
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-green-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-slate-200">In-Game Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">
                Use /help or /ticket commands in-game for immediate assistance from our staff.
              </p>
              <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                In-Game Commands
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-slate-900/50 border-slate-800 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Admin Team</h3>
              <p className="text-slate-400 mb-4">
                Our dedicated admin team is available 24/7 to ensure the best gaming experience for all players.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Owner: AuroraAdmin</Badge>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Admin: StaffMember1</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Mod: Helper123</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
