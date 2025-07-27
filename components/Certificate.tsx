import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const certifications = [
	{ id: 1, badge: "Gold", description: "Certified organic honey." },
	{ id: 2, badge: "Silver", description: "Sustainably harvested." },
];

// Custom Certificate component
const Certificate = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
		{certifications.map((cert) => (
			<Card
				key={cert.id}
				className="bg-yellow-50 border-2 border-yellow-300 shadow-md rounded-xl"
			>
				<CardHeader>
					<Badge
						className={`px-4 py-2 text-lg font-semibold rounded-full ${
							cert.badge === "Gold"
								? "bg-yellow-400 text-white"
								: "bg-gray-400 text-white"
						}`}
					>
						{cert.badge}
					</Badge>
				</CardHeader>
				<CardContent>
					<p className="text-gray-700 dark:text-gray-300 mb-4 text-base font-medium">
						{cert.description}
					</p>
				</CardContent>
			</Card>
		))}
	</div>
);

export default Certificate;