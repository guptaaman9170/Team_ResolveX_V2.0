import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Brain,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [reports, setReports] = useState([
    {
      id: "CR-2024-001",
      title: "Large pothole on Main Street",
      category: "Pothole",
      status: "in-progress",
      priority: "high",
      location: "Main St & Oak Ave",
      createdAt: "2024-01-15",
      votes: 23,
      comments: [
        { id: 1, text: "This needs urgent fixing!", likes: 2, dislikes: 0 },
        { id: 2, text: "My car was damaged here yesterday.", likes: 1, dislikes: 1 },
        { id: 3, text: "Dangerous for bikers at night.", likes: 0, dislikes: 0 },
        { id: 4, text: "Please repair ASAP.", likes: 3, dislikes: 0 },
        { id: 5, text: "It’s getting worse after rain.", likes: 0, dislikes: 2 }
      ],
      assignedTo: "Public Works Dept",
      description: "Large pothole causing traffic issues and potential vehicle damage.",
      aiConfidence: 95
    },
    {
      id: "CR-2024-002", 
      title: "Broken streetlight on Park Road",
      category: "Street Light",
      status: "resolved",
      priority: "medium",
      location: "Park Rd, Block 4",
      createdAt: "2024-01-14",
      votes: 15,
      comments: [
        { id: 1, text: "This needs urgent fixing!", likes: 2, dislikes: 0 },
        { id: 2, text: "My car was damaged here yesterday.", likes: 1, dislikes: 1 },
        { id: 3, text: "Dangerous for bikers at night.", likes: 0, dislikes: 0 },
        { id: 4, text: "Please repair ASAP.", likes: 3, dislikes: 0 },
        { id: 5, text: "It’s getting worse after rain.", likes: 0, dislikes: 2 }
      ],
      assignedTo: "Electrical Dept",
      description: "Streetlight not working, creating safety concerns for pedestrians.",
      aiConfidence: 87
    },
    {
      id: "CR-2024-003",
      title: "Garbage overflow at Central Market",
      category: "Garbage",
      status: "pending",
      priority: "high",
      location: "Central Market, Section B",
      createdAt: "2024-01-13",
      votes: 31,
      comments: [
        { id: 1, text: "This needs urgent fixing!", likes: 2, dislikes: 0 },
        { id: 2, text: "My car was damaged here yesterday.", likes: 1, dislikes: 1 },
        { id: 3, text: "Dangerous for bikers at night.", likes: 0, dislikes: 0 },
        { id: 4, text: "Please repair ASAP.", likes: 3, dislikes: 0 },
        { id: 5, text: "It’s getting worse after rain.", likes: 0, dislikes: 2 }
      ],
      assignedTo: "Sanitation Dept",
      description: "Multiple garbage bins overflowing, creating unsanitary conditions.",
      aiConfidence: 92
    },
    {
      id: "CR-2024-004",
      title: "Traffic signal malfunction",
      category: "Traffic",
      status: "in-progress",
      priority: "high",
      location: "Highway Intersection",
      createdAt: "2024-01-12",
      votes: 42,
      comments: [
        { id: 1, text: "This needs urgent fixing!", likes: 2, dislikes: 0 },
        { id: 2, text: "My car was damaged here yesterday.", likes: 1, dislikes: 1 },
        { id: 3, text: "Dangerous for bikers at night.", likes: 0, dislikes: 0 },
        { id: 4, text: "Please repair ASAP.", likes: 3, dislikes: 0 },
        { id: 5, text: "It’s getting worse after rain.", likes: 0, dislikes: 2 }
      ],
      assignedTo: "Traffic Control",
      description: "Traffic lights stuck on red, causing major traffic backup.",
      aiConfidence: 98
    }
  ]);

  const [votedReports, setVotedReports] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState<{ [key: number]: "like" | "dislike" | null }>({});
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const handleCommentReaction = (reportId: string, commentId: number, action: "like" | "dislike") => {
    setReports(prevReports =>
      prevReports.map(r =>
        r.id === reportId
          ? {
              ...r,
              comments: r.comments.map(c => {
                if (c.id !== commentId) return c;

                const prevReaction = commentReactions[commentId] || null;
                let updatedLikes = c.likes;
                let updatedDislikes = c.dislikes;

                if (action === "like") {
                  if (prevReaction === "like") {
                    updatedLikes -= 1;
                    setCommentReactions(prev => ({ ...prev, [commentId]: null }));
                  } else {
                    updatedLikes += 1;
                    if (prevReaction === "dislike") updatedDislikes -= 1;
                    setCommentReactions(prev => ({ ...prev, [commentId]: "like" }));
                  }
                } else if (action === "dislike") {
                  if (prevReaction === "dislike") {
                    updatedDislikes -= 1;
                    setCommentReactions(prev => ({ ...prev, [commentId]: null }));
                  } else {
                    updatedDislikes += 1;
                    if (prevReaction === "like") updatedLikes -= 1;
                    setCommentReactions(prev => ({ ...prev, [commentId]: "dislike" }));
                  }
                }

                return { ...c, likes: updatedLikes, dislikes: updatedDislikes };
              }),
            }
          : r
      )
    );
  };

  const handleVote = (id: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id
          ? {
              ...report,
              votes: votedReports.includes(id) ? report.votes - 1 : report.votes + 1
            }
          : report
      )
    );

    setVotedReports(prev =>
      prev.includes(id) ? prev.filter(voteId => voteId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "status-pending border-l-4 border-l-warning";
      case "in-progress": return "status-progress border-l-4 border-l-primary";
      case "resolved": return "status-resolved border-l-4 border-l-success";
      default: return "border-l-4 border-l-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-emergency bg-emergency/10 border-emergency/20";
      case "medium": return "text-warning bg-warning/10 border-warning/20";
      case "low": return "text-success bg-success/10 border-success/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const stats = [
    { title: "Total Reports", value: "1,247", change: "+12%", icon: AlertTriangle, color: "text-primary" },
    { title: "Resolved Issues", value: "856", change: "+8%", icon: CheckCircle, color: "text-success" },
    { title: "Active Citizens", value: "3,421", change: "+15%", icon: Users, color: "text-accent" },
    { title: "Response Time", value: "2.3 hrs", change: "-5%", icon: Clock, color: "text-warning" }
  ];

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterStatus === "all" || report.status === filterStatus) &&
    (filterCategory === "all" || report.category.toLowerCase().includes(filterCategory.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Civic Reports <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and track civic issues across your community in real-time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-civic">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="card-civic mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="street">Street Light</SelectItem>
                    <SelectItem value="garbage">Garbage</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className={`card-report ${getStatusColor(report.status)}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {report.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {report.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`px-3 py-1 ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Brain className="w-4 h-4" />
                          AI: {report.aiConfidence}%
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{report.votes} votes</span>
                        </div>

                        <div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setOpenComments(openComments === report.id ? null : report.id)
                          }
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{report.comments.length} comments</span>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {report.assignedTo}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedReport(expandedReport === report.id ? null : report.id)
                          }
                        >
                          View Details
                        </Button>

                        <Button
                          variant={votedReports.includes(report.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(report.id)}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${votedReports.includes(report.id) ? "text-blue-500" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>

                    {expandedReport === report.id && (
                      <div className="mt-4 border-t pt-4 bg-muted/30 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Issue Details</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>

                        <div className="mb-2">
                          <span className="text-sm font-medium">Assigned To:</span>{" "}
                          <Badge variant="outline">{report.assignedTo}</Badge>
                        </div>

                        <div className="mb-2">
                          <span className="text-sm font-medium">Status:</span>{" "}
                          <Badge>{report.status.toUpperCase()}</Badge>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium mb-1">Resolution Progress</p>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                report.status === "resolved"
                                  ? "bg-green-500"
                                  : report.status === "in-progress"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                              }`}
                              style={{
                                width:
                                  report.status === "resolved"
                                    ? "100%"
                                    : report.status === "in-progress"
                                    ? "60%"
                                    : "20%",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {openComments === report.id && (
                  <div className="mt-4 border-t pt-4 bg-muted/20 rounded-lg p-4">
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                      {report.comments.length > 0 ? (
                        report.comments.map((c) => (
                          <div key={c.id} className="flex items-center justify-between text-sm text-muted-foreground bg-white/5 p-2 rounded-md">
                            <span>• {c.text}</span>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleCommentReaction(report.id, c.id, "like")}
                                className={`flex items-center gap-1 ${commentReactions[c.id] === "like" ? "text-blue-500" : ""}`}
                              >
                                👍 {c.likes}
                              </button>

                              <button
                                onClick={() => handleCommentReaction(report.id, c.id, "dislike")}
                                className={`flex items-center gap-1 ${commentReactions[c.id] === "dislike" ? "text-red-500" : ""}`}
                              >
                                👎 {c.dislikes}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No comments yet.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          if (!newComment.trim()) return;

                          setReports((prev) =>
                            prev.map((r) =>
                              r.id === report.id
                                ? {
                                    ...r,
                                    comments: [
                                      ...r.comments,
                                      {
                                        id: Date.now(),
                                        text: newComment,
                                        likes: 0,
                                        dislikes: 0,
                                      },
                                    ],
                                  }
                                : r
                            )
                          );

                          setNewComment("");
                        }}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredReports.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Load More Reports
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredReports.length === 0 && (
          <Card className="card-civic">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find more reports.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
