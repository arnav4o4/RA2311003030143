"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Box, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel, Chip,
  CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';
import { Log } from 'logging_middleware';

const NOTIFICATIONS_URL = 'http://20.207.122.201/evaluation-service/notifications';
const WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

export default function Home() {
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(10);
  const [filterType, setFilterType] = useState('All');
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load viewed IDs from localStorage
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) {
      setViewedIds(new Set(JSON.parse(saved)));
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      await Log('frontend', 'info', 'api', 'Fetching notifications');
      const response = await axios.get(NOTIFICATIONS_URL, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
        }
      });
      setNotifications(response.data.notifications || []);
      // @ts-ignore
      await Log('frontend', 'info', 'api', `Successfully fetched ${response.data.notifications?.length} notifications`);
    } catch (err: any) {
      setError('Failed to fetch notifications');
      // @ts-ignore
      await Log('frontend', 'error', 'api', `Error fetching notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
    // @ts-ignore
    Log('frontend', 'info', 'state', `Marked notification ${id} as viewed`);
  };

  const priorityNotifications = useMemo(() => {
    // Priority inbox should show top 'n' UNREAD notifications
    let filtered = notifications.filter(n => !viewedIds.has(n.ID));
    
    if (filterType !== 'All') {
      filtered = filtered.filter(n => n.Type === filterType);
    }

    return filtered.sort((a, b) => {
      const weightA = WEIGHTS[a.Type as keyof typeof WEIGHTS] || 0;
      const weightB = WEIGHTS[b.Type as keyof typeof WEIGHTS] || 0;
      if (weightB !== weightA) return weightB - weightA;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    }).slice(0, limit);
  }, [notifications, viewedIds, filterType, limit]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Campus Notifications Portal
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered color="primary">
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Box>
          {tab === 1 && (
            <Box display="flex" gap={2} mb={3} justifyContent="center" alignItems="center">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select value={filterType} label="Filter by Type" onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Placement">Placements</MenuItem>
                  <MenuItem value="Result">Results</MenuItem>
                  <MenuItem value="Event">Events</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Show Top</InputLabel>
                <Select value={limit} label="Show Top" onChange={(e) => setLimit(Number(e.target.value))}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          <TableContainer component={Paper} elevation={3}>
            <Table aria-label="notifications table">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(tab === 0 ? notifications : priorityNotifications).map((n) => (
                  <TableRow 
                    key={n.ID} 
                    hover 
                    onClick={() => handleView(n.ID)}
                    sx={{ 
                      cursor: 'pointer', 
                      bgcolor: viewedIds.has(n.ID) ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={n.Type} 
                        size="small" 
                        sx={{ 
                          fontWeight: 'bold',
                          bgcolor: n.Type === 'Placement' ? '#e8f5e9' : n.Type === 'Result' ? '#fff3e0' : '#f3e5f5',
                          color: n.Type === 'Placement' ? '#2e7d32' : n.Type === 'Result' ? '#ef6c00' : '#7b1fa2'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: viewedIds.has(n.ID) ? 400 : 700 }}>
                      {n.Message}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{n.Timestamp}</TableCell>
                    <TableCell align="center">
                      {viewedIds.has(n.ID) ? (
                        <Typography variant="caption" color="textSecondary">VIEWED</Typography>
                      ) : (
                        <Chip label="NEW" size="small" color="primary" variant="filled" sx={{ height: 20, fontSize: '0.65rem' }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(tab === 1 && priorityNotifications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No new notifications matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
}
